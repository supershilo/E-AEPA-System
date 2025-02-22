
package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<EvaluationEntity, Integer> {
    @Query(value = "SELECT * FROM tblevaluation eval WHERE eval.is_deleted = 0", nativeQuery = true)
    List<EvaluationEntity> findAllEvals();

    //return peer id using eval id
    @Query("SELECT e.peer.userID FROM EvaluationEntity e WHERE e.evalID = :evalID AND e.isDeleted = 0")
    Integer findPeerIDByEvalID(@Param("evalID") int evalID);

    //Query to get evaluation id
    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIDAndPeriodAndStageAndEvalType(int userID, String period, String stage, String evalType);

    //Query to get evaluation id for assigned peer
    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(peer_id) = :peerID AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIDAndPeriodAndStageAndEvalTypeAndPeerID(int userID, String period, String stage, String evalType, int peerID);

    //Query evaluation id for HEAD
    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(peer_id) = :empID  AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType);


    //Query to check evaluation status SELF and PEER
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDPeriodStageAndEvalType(int userID, String period, String stage, String evalType);


    //Query to check evaluation status HEAD
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(peer_id) = :empID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDEmpIDPeriodStageAndEvalType(int userID, int empID, String period, String stage, String evalType);

 //total employees for recommendation
 @Query("SELECT COUNT(e) FROM EvaluationEntity e WHERE e.period = '5th Month' AND e.status = 'COMPLETED'")
 long countByPeriodAndStatus();
    //Query to check annual evaluation status with schoolYear
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(school_year) = :schoolYear AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDPeriodStageEvalTypeAndSchoolYear(int userID, String period, String stage, String evalType, String schoolYear);


 // Open Evaluation for 3rd , 5th , and Annual
 @Query("SELECT COUNT(DISTINCT e.user.userID) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '3rd Month' " +
         "AND e.status = 'OPEN'")
 long countOpenForThirdMonth();

 @Query("SELECT COUNT(DISTINCT e.user.userID) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '5th Month' " +
         "AND e.status = 'OPEN'")
 long countOpenForFifthMonth();

 @Query("SELECT COUNT(DISTINCT e.user.userID) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = 'Annual' " +
         "AND e.status = 'OPEN'")
 long countOpenForAnnual();


//total employees
 @Query("SELECT COUNT(DISTINCT e.user.id) FROM EvaluationEntity e")
 long countUniqueUserIds();

 //3rd Month Evaluation Completed - PerDepartment
 @Query("SELECT e.user.dept, COUNT(DISTINCT e.user.id) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '3rd Month' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = '3rd Month' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '3rd Month' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '3rd Month' AND eee.stage = 'JOB') = 2) " +
         ") " +
         "GROUP BY e.user.dept")
 List<Object[]> countCompletedForThirdMonthPerDept();


 //Annual Evaluation Per Department : Complete
 @Query("SELECT e.user.dept, COUNT(DISTINCT e.user.id) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = 'Annual' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = 'Annual' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = 'Annual' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = 'Annual' AND eee.stage = 'JOB') = 2) " +
         ") " +
         "GROUP BY e.user.dept")
   List<Object[]> countCompletedForAnnualPerDept();



 //5th Month Evaluation Per Department : Complete
 @Query("SELECT e.user.dept, COUNT(DISTINCT e.user.id) " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '5th Month' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = '5th Month' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '5th Month' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '5th Month' AND eee.stage = 'JOB') = 2) " +
         ") " +
         "GROUP BY e.user.dept")
 List<Object[]> countCompletedForFifthMonthPerDept();


 //Get List of users completed 3rd Month Evaluation
 @Query("SELECT DISTINCT e.user.id " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '3rd Month' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = '3rd Month' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '3rd Month' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '3rd Month' AND eee.stage = 'JOB') = 2) " +
         ")")
 List<Long> getCompleted3rdMonthEvaluation();


 //get List of users completed 5th Month Evaluation
 @Query("SELECT DISTINCT e.user.id " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = '5th Month' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = '5th Month' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '5th Month' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = '5th Month' AND eee.stage = 'JOB') = 2) " +
         ")")
 List<Long> getCompleted5thMonthEvaluation();

 //get List of users completed Annual
 @Query("SELECT DISTINCT e.user.id " +
         "FROM EvaluationEntity e " +
         "WHERE e.period = 'Annual' " +
         "AND e.status = 'COMPLETED' " +
         "AND e.user.id IN (" +
         "    SELECT ee.user.id " +
         "    FROM EvaluationEntity ee " +
         "    WHERE ee.period = 'Annual' " +
         "    AND ee.status = 'COMPLETED' " +
         "    GROUP BY ee.user.id " +
         "    HAVING " +
         "        SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'VALUES' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = 'Annual' AND eee.stage = 'VALUES') = 2) " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
         "        AND SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
         "        AND (SUM(CASE WHEN ee.stage = 'JOB' AND ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0 OR " +
         "             (SELECT COUNT(eee.evalType) FROM EvaluationEntity eee WHERE eee.user.id = ee.user.id AND eee.period = 'Annual' AND eee.stage = 'JOB') = 2) " +
         ")")
 List<Long> getCompletedAnnualEvaluation();




     @Query("SELECT e FROM EvaluationEntity e WHERE e.user.userID = :userID")
    List<EvaluationEntity> findByUserID(@Param("userID") int userID);

    @Query(value = "SELECT * FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(peer_id) = :empID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    EvaluationEntity findEvalByUserIdPeriodStageHead(@Param("userID") int userID, @Param("empID") int empID, @Param("period") String period, @Param("stage") String stage, @Param("evalType") String evalType);

    @Query("SELECT e FROM EvaluationEntity e WHERE e.user.userID = :userID AND e.peer.userID = :peerID AND e.period = :period AND e.evalType = :evalType AND e.schoolYear = :schoolYear AND e.semester = :semester AND e.isDeleted = 0")
    List<EvaluationEntity> findByUserIDAndPeerIDAndPeriodAndEvalType(int userID, int peerID, String period, String evalType, String schoolYear, String semester);


    
}
